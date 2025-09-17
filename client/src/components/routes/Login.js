import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background-color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
`

const Card = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 28rem;
`

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
`

const Form = styled.form``

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: #374151;
  border-radius: 0.375rem;
  border: 1px solid #4b5563;
  color: #fff;
  outline: none;
  &:focus {
    box-shadow: 0 0 0 2px #3b82f6;
  }
`

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`

const ErrorText = styled.p`
  color: #f87171;
  text-align: center;
  margin-bottom: 1rem;
`

const Button = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: #fff;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: 0.3s;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
  }
`

const FooterText = styled.p`
  text-align: center;
  color: #9ca3af;
  margin-top: 1.5rem;
`

const FooterLink = styled.a`
  color: #60a5fa;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

// 🔹 FUNCIÓN LOGIN COMPLETA
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        credentials: 'include' // para que viaje la cookie refreshToken
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to login')

      // Guardar access token y user
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.data.id,
          username: data.data.username,
          email: data.data.email,
        })
      )

      // Redirigir a proyectos
      navigate('/projects')
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
          Don&apos;t have an account?{' '}
          <FooterLink href="/register">Register here</FooterLink>
        </FooterText>
      </Card>
    </Container>
  )
}

export default Login
