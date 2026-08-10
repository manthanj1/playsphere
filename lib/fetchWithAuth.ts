import Cookies from 'js-cookie';

export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = Cookies.get('token') || "";

  if (!token) {
    console.warn("No auth token found in cookies. Request will be sent without a token.");
  }


  // Define headers using the HeadersInit type
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = endpoint.startsWith("/")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}