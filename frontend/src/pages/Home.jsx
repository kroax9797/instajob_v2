import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function Navbar({ openForm, openContact, scrollToAbout }) {
  return (
    <nav className="w-full border-b shadow-sm py-4 px-8 flex justify-between items-center bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">InstaJob</h1>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={scrollToAbout}>About Us</Button>
        <Button variant="outline" onClick={openContact}>Contact</Button>
      </div>
    </nav>
  );
}


function Hero({ openForm }) {
  return (
    <section className="w-full min-h-svh py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight">
          InstaJob: Instant Hiring, Instant Updates.
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-accent-foreground sm:text-xl mb-10">
          Say goodbye to ghosted applications. Our AI-powered platform gives real-time feedback to candidates, and lets recruiters focus only on top profiles.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          <Button
            size="lg"
            className="text-lg h-14"
            onClick={() => openForm("user-login")}
          >
            👤 User Login
          </Button>
          <Button
            size="lg"
            className="text-lg h-14"
            onClick={() => openForm("user-signup")}
          >
            ✍️ User Signup
          </Button>
          <Button
            size="lg"
            className="text-lg h-14"
            onClick={() => openForm("recruiter-login")}
          >
            🧑‍💼 Recruiter Login
          </Button>
          <Button
            size="lg"
            className="text-lg h-14"
            onClick={() => openForm("recruiter-signup")}
          >
            📝 Recruiter Signup
          </Button>
        </div>
      </div>
    </section>
  );
}


function AboutUs({ aboutRef }) {
  return (
    <section ref={aboutRef} className="py-24 px-6 bg-gray-100 text-center">
      <h3 className="text-3xl font-semibold mb-4">About InstaJob</h3>
      <p className="max-w-3xl mx-auto text-gray-700 text-lg">
        InstaJob is a fast, AI-powered hiring platform that streamlines recruitment and job applications. 
        Candidates know instantly if they pass initial screening, and recruiters only focus on qualified talent.
        Say goodbye to delays and ghosting – we bring transparency and speed to hiring.
      </p>
    </section>
  )
}


function ContactDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Write your message..." rows={4} />
          <Button type="submit">Send Message</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


function AuthDialog({ type, isOpen, onClose , BASE_URL}) {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const titleMap = {
    "user-login": "User Login",
    "user-signup": "User Signup",
    "recruiter-login": "Recruiter Login",
    "recruiter-signup": "Recruiter Signup",
  };

  const isUserSignup = type === "user-signup";
  const isRecruiterSignup = type === "recruiter-signup";
  const isUserLogin = type === "user-login";
  const isRecruiterLogin = type === "recruiter-login";

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      // 🟢 User Signup
      if (isUserSignup) {
        const dataToSend = new FormData();
        if (formData.resume) {
          dataToSend.append("resume_file", formData.resume);
        }

        const queryParams = new URLSearchParams({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        response = await fetch(
          `${BASE_URL}/register/applicant?${queryParams}`,
          {
            method: "POST",
            body: dataToSend,
          }
        );

        if (!response.ok) throw new Error("User registration failed");
        const userData = await response.json();
        console.log(userData);

        navigate("/applicant/dashboard", { state: userData }); // 🔁 Send to next page
      }

      // 🟢 Recruiter Signup
      else if (isRecruiterSignup) {
        const queryParams = new URLSearchParams({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password,
        });

        response = await fetch(
          `${BASE_URL}/register/recruiter?${queryParams}`,
          { method: "POST" }
        );

        if (!response.ok) throw new Error("Recruiter registration failed");
        const recruiterData = await response.json();
        console.log(formData);

        navigate("/recruiter/dashboard", { state: formData });
      }

      // 🔐 User Login
      else if (isUserLogin) {
        const queryParams = new URLSearchParams({ 
          email: formData.email,
          password: formData.password,
        })
        response = await fetch(`${BASE_URL}/login/applicant?${queryParams}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Invalid credentials");
        const userData = await response.json();
        console.log(userData);

        navigate("/applicant/dashboard", { state: userData });
      }

      // 🔐 Recruiter Login
      else if (isRecruiterLogin) {
        const queryParams = new URLSearchParams({
          email: formData.email,
          password: formData.password,
        })
        response = await fetch(`${BASE_URL}/login/recruiter?${queryParams}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Invalid credentials");
        const recruiterData = await response.json();
        console.log(recruiterData);

        navigate("/recruiter/dashboard", { state: recruiterData });
      }

      onClose(); // ✅ Close dialog on success
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titleMap[type]}</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {(isUserSignup || isRecruiterSignup) && (
            <>
              <Label htmlFor="name">Name</Label>
              <Input id="name" onChange={handleChange} />
            </>
          )}

          {isRecruiterSignup && (
            <>
              <Label htmlFor="company">Company</Label>
              <Input id="company" onChange={handleChange} />
            </>
          )}

          {isUserSignup && (
            <>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" onChange={handleChange} />

              <Label htmlFor="resume">Upload Resume (PDF)</Label>
              <Input id="resume" type="file" accept=".pdf" onChange={handleChange} />
            </>
          )}

          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" onChange={handleChange} />

          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" onChange={handleChange} />

          <Button type="submit" onClick = {handleSubmit}>Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function Footer() {
  return (
    <footer className="w-full border-t mt-auto py-6 px-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} InstaJob · Built with ❤️ by Tejas
    </footer>
  );
}


function Home() {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ;
  const [formType, setFormType] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)
  const aboutRef = useRef(null)

  const openForm = (type) => setFormType(type)
  const closeForm = () => setFormType(null)

  const openContact = () => setContactOpen(true)
  const closeContact = () => setContactOpen(false)

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <Navbar openForm={openForm} openContact={openContact} scrollToAbout={scrollToAbout} />
      
      <main className="overflow-auto">
        <Hero openForm={openForm} />
        {/* AboutUs will not be shown by default, only when scrolled to */}
        <AboutUs aboutRef={aboutRef} />
        {formType && <AuthDialog type={formType} isOpen={!!formType} onClose={closeForm} BASE_URL={BASE_URL}/>}
        <ContactDialog isOpen={contactOpen} onClose={closeContact} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;