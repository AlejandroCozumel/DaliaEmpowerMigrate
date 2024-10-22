'use client';

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  gap?: string;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center,
  gap,
}) => {
  return (
    <div className={`${center ? 'text-center' : 'text-start'} ${gap ? `flex flex-col ${gap}` : ''} `}>
      <div className="text-2xl font-bold">
        {title}
      </div>
      <div className="font-light text-neutral-500 mt-2">
        {subtitle}
      </div>
    </div>
   );
}

export default Heading;