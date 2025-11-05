const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Hämta alla meetups
 */
export async function getAllMeetups() {
  try {
    const res = await fetch(`${API_URL}/meetups`);
    const data = await res.json();

    if (!res.ok)
      throw new Error(data.message || data.error || "Kunde inte hämta meetups");
    return data;
  } catch (err) {
    console.error("getAllMeetups error:", err);
    throw new Error(err.message || "Nätverksfel vid hämtning av meetups");
  }
}

/**
 * Hämta en specifik meetup via ID
 */
export async function getMeetupById(id) {
  try {
    const res = await fetch(`${API_URL}/meetups/${id}`);
    const data = await res.json();

    if (!res.ok)
      throw new Error(data.message || data.error || "Kunde inte hämta meetup");
    return data;
  } catch (err) {
    console.error("getMeetupById error:", err);
    throw new Error(err.message || "Nätverksfel vid hämtning av meetup");
  }
}

/**
 * Skapa ett nytt meetup (kräver JWT-token)
 */
export async function createMeetup(meetupData, token) {
  try {
    const authToken = token || localStorage.getItem("token");

    const res = await fetch(`${API_URL}/meetups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...meetupData,
        categories: Array.isArray(meetupData.categories)
          ? meetupData.categories
          : [meetupData.categories].filter(Boolean),
      }),
    });

    
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok)
      throw new Error(data.message || data.error || "Kunde inte skapa meetup");

    return data;
  } catch (err) {
    console.error("createMeetup error:", err);
    throw new Error(err.message || "Nätverksfel vid skapande av meetup");
  }
}

/**
 * Gå med i en meetup (kräver JWT-token)
 */
export async function joinMeetup(id, token) {
  try {
    const res = await fetch(`${API_URL}/meetups/${id}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || data.error || "Kunde inte gå med i meetup");
    return data;
  } catch (err) {
    console.error("joinMeetup error:", err);
    throw new Error(err.message || "Nätverksfel vid anmälan till meetup");
  }
}

/**
 * Lämna en meetup (kräver JWT-token)
 */
export async function leaveMeetup(id, token) {
  try {
    const res = await fetch(`${API_URL}/meetups/${id}/join`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.message || data.error || "Kunde inte lämna meetup"
      );
    return data;
  } catch (err) {
    console.error("leaveMeetup error:", err);
    throw new Error(err.message || "Nätverksfel vid avanmälan från meetup");
  }
}

/**
 * Skapa en recension för ett meetup
 */
export async function createReview(meetupId, reviewData, token) {
  try {
    const res = await fetch(`${API_URL}/meetups/${meetupId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Kunde inte skapa recension");
    return data.review;
  } catch (err) {
    console.error("createReview error:", err);
    throw new Error(err.message || "Nätverksfel vid skapande av recension");
  }
}

/**
 * Hämta recensioner för ett meetup
 */
export async function getReviews(meetupId) {
  try {
    const res = await fetch(`${API_URL}/meetups/${meetupId}/reviews`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Kunde inte hämta recensioner");
    return data.reviews;
  } catch (err) {
    console.error("getReviews error:", err);
    throw new Error(err.message || "Nätverksfel vid hämtning av recensioner");
  }
}