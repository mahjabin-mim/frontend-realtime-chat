"use client";
import UserLogin from "./(user)/userLogin/page";
import "./globals.css"

export default function Home() {
  // const [welcome, setWelcome] = useState("");
  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
  //     .then((res) => res.text())
  //     .then((data) => setWelcome(data))
  //     .catch((err) => setWelcome(err.message));
  // });
  //return <h1>hello world</h1>;
  return <UserLogin/>
}