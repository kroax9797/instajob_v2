import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function CreateJobPostDialog({ recruiterEmail }) {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ;
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    jd_file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      jd_file: e.target.files[0],
    }));
  };

  const handleCreateJobPost = async () => {
    if (!formData.jd_file) {
      alert("Please upload a PDF job description.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("salary", formData.salary);
    form.append("recruiter_email", recruiterEmail);
    form.append("job_description", formData.jd_file); // This is the file

    try {
      setIsSubmitting(true);

      const res = await fetch(`${BASE_URL}/register/job_post`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to post job.");
    } finally {
      setIsSubmitting(false);
      setFormData({
        title: "",
        location: "",
        salary: "",
        recruiter_email : recruiterEmail ,
        jd_file: null,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 p-2 hover:p-4">
          <Plus size={32} /> Post Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Job Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Bengaluru, India"
            />
          </div>

          <div>
            <Label>Salary</Label>
            <Input
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. ₹10,00,000"
            />
          </div>

          <div>
            <Label>Job Description (PDF)</Label>
            <Input type="file" accept=".pdf" onChange={handleFileChange} />
          </div>

          <Button onClick={handleCreateJobPost} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
