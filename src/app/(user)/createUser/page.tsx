"use client"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const CreateUser = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const router = useRouter();

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const sendData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await res.text();
        alert(result);
        //router.push("/login");
      } catch (error) {
        alert("error");
      }
    };
    sendData();
  };

  return (
    <div>
      <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          required
        />
        <br></br>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          required
        />
        <br></br>
        <label htmlFor="password">Password:</label>
        <textarea
          name="password"
          value={data.password}
          onChange={handleChange}
          required
        ></textarea>
        <br></br>
        <button
            type="submit"
          >
            Create
          </button>
      </form>
      </div>
    </div>
  );
};

export default CreateUser;
