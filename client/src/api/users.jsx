export const updateUserData = async (payload) => {
  const token = localStorage.getItem('accessToken');

  const res = await fetch('/api/users/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar usuario');
  return data.data; // usuario actualizado
};