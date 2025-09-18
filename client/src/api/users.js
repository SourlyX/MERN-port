export const updateUserData = async (token, incomes, expenses) => {
  const res = await fetch('http://localhost:5001/api/users/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ incomes, expenses }),
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.data
}
