import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background-color: #1f2937; // bg-gray-900
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Card = styled.div`
  background-color: #1f2937; // bg-gray-800
  padding: 2rem;
  border-radius: 2rem; // rounded-2xl
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 28rem; // max-w-md
`

const Title = styled.h2`
  font-size: 1.875rem; // text-3xl
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
`

const Form = styled.form``

const Input = styled.input`
  width: 100%;
  padding: 0.75rem; // p-3
  background-color: #374151; // bg-gray-700
  border-radius: 0.375rem; // rounded-md
  border: 1px solid #4b5563; // border-gray-600
  color: #fff;
  outline: none;
  &:focus {
    ring: 2px; 
    box-shadow: 0 0 0 2px #3b82f6; // focus:ring-blue-500
  }
`

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`

const ErrorText = styled.p`
  color: #f87171; // text-red-400
  text-align: center;
  margin-bottom: 1rem;
`

const Button = styled.button`
  width: 100%;
  background-color: #2563eb; // bg-blue-600
  color: #fff;
  font-weight: bold;
  padding: 0.75rem; // py-3
  border-radius: 0.375rem; // rounded-md
  transition: 0.3s;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #1d4ed8; // hover:bg-blue-700
  }

  &:disabled {
    background-color: #6b7280; // disabled:bg-gray-500
    cursor: not-allowed;
  }
`

const FooterText = styled.p`
  text-align: center;
  color: #9ca3af; // text-gray-400
  margin-top: 1.5rem;
`

const FooterLink = styled.a`
  color: #60a5fa; // text-blue-400
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to login')

      console.log('Login successful!', data.data)
      alert(`Welcome back, ${data.data.username}!`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <FooterText>
          Don't have an account?{' '}
          <FooterLink href="/register">Register here</FooterLink>
        </FooterText>
      </Card>
    </Container>
  )
}

export default Login
