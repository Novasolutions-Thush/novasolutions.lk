"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProject } from "@/lib/projects";

export default function EditProjectPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, project: null, error: false });

  useEffect(() => {
    let active = true;
    getProject(id)
      .then((project) => active && setState({ loading: false, project, error: false }))
      .catch(() => active && setState({ loading: false, project: null, error: true }));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-300 hover:opacity-70"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>
      <h2 className="mb-6 mt-4 text-2xl font-extrabold">Edit Project</h2>

      {state.loading && (
        <div className="grid place-items-center border border-line bg-surface p-16">
          <Loader2 size={30} className="animate-spin text-accent" />
        </div>
      )}

      {!state.loading && (state.error || !state.project) && (
        <div className="border border-line bg-surface p-10 text-center">
          <AlertCircle size={40} className="mx-auto text-red-500" />
          <p className="mt-4 font-semibold">
            {state.error ? "Could not load this project." : "Project not found."}
          </p>
        </div>
      )}

      {!state.loading && state.project && <ProjectForm project={state.project} />}
    </div>
  );
}