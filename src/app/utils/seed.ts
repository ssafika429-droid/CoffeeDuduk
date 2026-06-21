const API_BASE = 'http://localhost:5000/api';

export async function seedDatabase() {
  try {
    const response = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Seed failed');
    }

    return data;
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}
