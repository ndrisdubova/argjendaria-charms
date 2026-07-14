// One-time migration: move base64 product images out of the database and into
// Supabase Storage, leaving only a URL behind.
//
//   node scripts/migrate-images.mjs --dry-run   # report only, changes nothing
//   node scripts/migrate-images.mjs             # do it
//
// Safe to re-run: rows whose image is already a URL are skipped.
// Needs SUPABASE_SERVICE_KEY in .env.local (that file is gitignored).

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const BUCKET = 'product-images'
const DRY_RUN = process.argv.includes('--dry-run')

function loadEnv() {
  const env = {}
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_KEY

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } })

// data:image/jpeg;base64,AAAA... -> { buffer, contentType, ext }
function decodeDataUri(dataUri) {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(dataUri)
  if (!m) return null
  const contentType = m[1]
  const ext = contentType.split('/')[1].replace('jpeg', 'jpg')
  return { buffer: Buffer.from(m[2], 'base64'), contentType, ext }
}

async function ensureBucket() {
  const { data: buckets, error } = await db.storage.listBuckets()
  if (error) throw error
  if (buckets.some((b) => b.name === BUCKET)) {
    console.log(`bucket "${BUCKET}" already exists`)
    return
  }
  if (DRY_RUN) {
    console.log(`would create public bucket "${BUCKET}"`)
    return
  }
  const { error: createErr } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })
  if (createErr) throw createErr
  console.log(`created public bucket "${BUCKET}"`)
}

async function uploadOne(path, decoded) {
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, decoded.buffer, { contentType: decoded.contentType, upsert: true })
  if (error) throw error
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Returns the replacement value for one image field, or null if nothing to do.
async function migrateField(value, path) {
  if (typeof value !== 'string' || !value.startsWith('data:')) return null
  const decoded = decodeDataUri(value)
  if (!decoded) {
    console.warn(`  ! could not decode ${path} — leaving as-is`)
    return null
  }
  if (DRY_RUN) return `<would upload ${(decoded.buffer.length / 1024).toFixed(0)}KB>`
  return uploadOne(`${path}.${decoded.ext}`, decoded)
}

async function main() {
  console.log(DRY_RUN ? '— DRY RUN: nothing will be changed —\n' : '— migrating for real —\n')

  await ensureBucket()

  const { data: products, error } = await db.from('products').select('id, name, image, gallery')
  if (error) throw error

  let migrated = 0
  let skipped = 0
  let bytesFreed = 0

  for (const p of products) {
    const patch = {}

    const newImage = await migrateField(p.image, `${p.id}/main`)
    if (newImage) {
      bytesFreed += p.image.length
      patch.image = newImage
    }

    const gallery = p.gallery || []
    if (gallery.some((g) => typeof g === 'string' && g.startsWith('data:'))) {
      const next = []
      for (let i = 0; i < gallery.length; i++) {
        const replaced = await migrateField(gallery[i], `${p.id}/g${i}`)
        if (replaced) bytesFreed += gallery[i].length
        next.push(replaced || gallery[i])
      }
      patch.gallery = next
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    if (!DRY_RUN) {
      const { error: updErr } = await db.from('products').update(patch).eq('id', p.id)
      if (updErr) throw updErr
    }

    migrated++
    console.log(`  ${DRY_RUN ? 'would migrate' : 'migrated'}: ${p.name}`)
  }

  console.log(`\n${migrated} migrated, ${skipped} already had URLs`)
  console.log(`~${(bytesFreed / 1024 / 1024).toFixed(2)} MB removed from the products payload`)
  if (DRY_RUN) console.log('\nNothing was changed. Re-run without --dry-run to apply.')
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message || err)
  process.exit(1)
})
