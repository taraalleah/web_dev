import React from "react";

const user = JSON.parse(localStorage.getItem("user"));

function ProfileComponent() {
  return (
    <main>
      <h2>Welcome to your profile!</h2>
      <p>
        Hello {user.email}!
      </p>
    </main>
  );
}

export default ProfileComponent;

