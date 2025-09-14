import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-gray-100 h-[60vh] flex items-center justify-center text-center px-6">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to FilmHive</h1>
        <p className="text-lg text-gray-300">
          Discover your next favorite movie. Explore trending films, hidden gems, and cinematic classics all in one place.
        </p>
      </div>
    </section>
  )
}

export default HeroSection