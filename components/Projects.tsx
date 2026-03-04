"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Github } from "lucide-react";

// 定义严谨的 TypeScript 接口，匹配我们在 SQL 中建的表结构
interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[]; // 注意这里改成了下划线命名，因为我们 SQL 里用的是 tech_stack
  github_link: string;
  live_link: string;
}

export default function Projects({ projectsData }: { projectsData: Project[] }) {
  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Projects</h2>
        <div className="w-20 h-1 bg-slate-900 rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 使用传入的 projectsData 进行渲染 */}
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                  <FolderGit2 className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex gap-3 text-slate-500">
                  <a href={project.github_link} className="hover:text-slate-900 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={project.live_link} className="hover:text-slate-900 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <ul className="flex flex-wrap gap-2 mt-auto">
              {project.tech_stack.map((tech) => (
                <li key={tech} className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}