import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="text-zinc-500 font-bold">
      Hİ!
      <br/>
      <Button 
        size="lg"
        variant="outline"
        className="bg-zinc-900"
      >
        Click me!
      </Button>
    </div>
  );
}
