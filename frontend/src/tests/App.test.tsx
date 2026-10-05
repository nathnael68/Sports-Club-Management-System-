import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App Routing', () => {
  it('renders login page by default when unauthenticated', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: /Sports Club AI/i })).toBeInTheDocument()
  })
})
