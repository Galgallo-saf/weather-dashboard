import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react';

export const WeatherIcon = ({ condition, size = "large", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-24 h-24"
  };

  const lowerCondition = condition?.toLowerCase() || "";
  
  let Icon = Sun;
  let colorClass = "text-yellow-400";
  let animationClass = "animate-spin-slow";

  if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) {
    Icon = Sun;
    colorClass = "text-yellow-400";
    animationClass = "animate-spin-slow";
  } else if (lowerCondition.includes("cloud")) {
    Icon = Cloud;
    colorClass = "text-gray-300";
    animationClass = "animate-float";
  } else if (lowerCondition.includes("rain")) {
    Icon = CloudRain;
    colorClass = "text-blue-400";
    animationClass = "animate-bounce";
  } else if (lowerCondition.includes("drizzle")) {
    Icon = CloudDrizzle;
    colorClass = "text-blue-300";
    animationClass = "animate-pulse";
  } else if (lowerCondition.includes("snow")) {
    Icon = CloudSnow;
    colorClass = "text-white";
    animationClass = "animate-float";
  } else if (lowerCondition.includes("thunder")) {
    Icon = CloudLightning;
    colorClass = "text-purple-400";
    animationClass = "animate-pulse";
  }

  return (
    <div className={`${sizeClasses[size]} ${className} ${animationClass}`}>
      <Icon className={`w-full h-full ${colorClass}`} strokeWidth={1.5} />
    </div>
  );
};