import { Button } from "flowbite-react";

interface TitleContentProps {
  title: string;
  contentButton?: string;
  onClick?: () => void;
}

export default function TitleContent({ title, contentButton, onClick }: TitleContentProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold dark:text-white text-gray-900">
        {title}
      </h1>
      {contentButton && onClick && (
        <Button color="green" onClick={onClick}>
          {contentButton}
        </Button>
      )}
    </div>
  );
}
