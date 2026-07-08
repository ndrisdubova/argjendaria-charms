import { Link } from 'react-router-dom'
import { Clock, Heart, Gem, Users } from 'lucide-react'
import { story, categoryImages } from '../data/images'
import Reveal from '../components/Reveal'
import '../pages/Home.css'
import './About.css'

const STATS = [
  { icon: Clock, value: '18+', label: 'Years of Experience' },
  { icon: Heart, value: '98%', label: 'Client Satisfaction' },
  { icon: Gem, value: '6,000+', label: 'Pieces Crafted' },
  { icon: Users, value: '4,200+', label: 'Happy Clients' },
]

const VALUES = [
  {
    title: 'Handcrafted Artistry',
    text: 'Every piece is shaped and set by master artisans, never mass produced.',
  },
  {
    title: 'Certified Gemstones',
    text: 'Each stone is ethically sourced and independently certified for quality.',
  },
  {
    title: 'Lifetime Warranty',
    text: 'We stand behind our craftsmanship with complimentary lifetime care.',
  },
  {
    title: 'Personal Service',
    text: 'From first visit to final fitting, every client gets a dedicated consultant.',
  },
]

function About() {
  return (
    <>
      <section className="section about-hero">
        <div className="container about-hero-inner">
          <span className="eyebrow">About Charm's</span>
          <h1>Fine Jewelry, Made to Last Generations</h1>
          <p className="hero-text">
            For nearly two decades, Charm's has been Gjilan's atelier of choice for
            handcrafted rings, necklaces, earrings and bracelets — built on trust,
            craftsmanship, and a genuine love for the pieces we make.
          </p>
        </div>
      </section>

      <section className="section story">
        <div className="container story-grid">
          <Reveal as="div" direction="left" className="story-visual">
            <div className="story-photo-main">
              <img src={story} alt="Charm's atelier display" className="story-img" loading="lazy" />
            </div>
            <div className="story-photo-accent">
              <img src={categoryImages.ring} alt="Handcrafted ring detail" loading="lazy" />
            </div>
          </Reveal>
          <Reveal as="div" direction="right" className="story-copy">
            <span className="eyebrow">Our Story</span>
            <h2>A Legacy Set in Gold</h2>
            <p>
              Charm's was founded on the belief that fine jewelry should feel personal.
              What began as a small family workshop in Gjilan has grown into a trusted
              atelier, while every piece is still conceived by hand, from wax to polish.
            </p>
            <p>
              Over the years we've had the privilege of marking our clients' most
              meaningful moments — engagements, anniversaries, milestones — and that
              trust is what we work every day to deserve.
            </p>
            <Link to="/products" className="story-link">View our collection &rarr;</Link>
          </Reveal>
        </div>
      </section>

      <section className="section-tight about-stats">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">By The Numbers</span>
            <h2>Experience You Can Trust</h2>
          </div>
          <div className="about-stats-grid">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div className="about-stat-card" key={label}>
                <Icon className="about-stat-icon" size={28} strokeWidth={1.5} />
                <span className="about-stat-value">{value}</span>
                <span className="about-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight values">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Charm's</span>
            <h2>Crafted With Care</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-mark" />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <h2>Find the Piece That Tells Your Story</h2>
          <p>Visit our atelier or reach out for a private, one-on-one styling session.</p>
          <Link to="/contact" className="btn btn-solid">Get in Touch</Link>
        </div>
      </section>
    </>
  )
}

export default About
