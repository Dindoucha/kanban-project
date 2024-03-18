const API_BASE_URL = "https://dindouchakanban.pythonanywhere.com/api";

const apiFetch = async (endpoint, method = 'GET', body = null, token = null) => {

  const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
  };

  if (token) {
      headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export default apiFetch;
