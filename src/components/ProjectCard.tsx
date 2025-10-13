import React from "react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  onClick?: () => void; // adiciona
  showMoreButton?: boolean; // adiciona
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id, 
  title,
  description,
  price,
  image,
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-md">
      <div className="h-32 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-eco-green-700">
            {price}/t
          </span>
          {/* <button
            onClick={() => navigate(`/projetos/${id}`)}
            className="text-xs px-3 py-1 rounded-full bg-eco-green-100 text-eco-green-700 font-medium"
          >
            Ver Mais
          </button> */}
        </div>
      </div>
    </div>
  );
};


export default ProjectCard;
