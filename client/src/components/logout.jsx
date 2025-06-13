import { useCookies } from "react-cookie";

const Logout = () => {
  const [, , removeCookie] = useCookies(["userEmail", "userToken"]); // Get the removeCookie function

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split('userToken=')[1]?.split(';')[0]}`, // Extract token from cookies
        },
      });

      if (response.ok) {
        // Remove cookies
        removeCookie("userEmail", { path: "/" });
        removeCookie("userToken", { path: "/" });

        alert("You have been logged out.");
        window.location.href = "/login"; // Redirect to login page
      } else {
        const data = await response.json();
        alert(data.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
