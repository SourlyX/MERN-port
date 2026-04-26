const refreshAccessToken = async () => {
  const res = await fetch("/api/users/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Session expired. Please log in again.");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

export const updateUserData = async (payload) => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  let res = await fetch("/api/users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  // Si el token expiró, renovar y reintentar
  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
      res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new Error("Session expired. Please log in again.");
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");
  return data.data;
};

export const fetchUserData = async () => {
  let token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No token found");

  let res = await fetch("/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};
