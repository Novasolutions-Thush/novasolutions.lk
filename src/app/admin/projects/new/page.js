import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-300 hover:opacity-70"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>
      <h2 className="mb-6 mt-4 text-2xl font-extrabold">Add New Project</h2>
      <ProjectForm />
    </div>
  );
}