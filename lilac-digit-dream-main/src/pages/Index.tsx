import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
        ✿ Pretty Calculator ✿
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Simple & Sweet
      </p>
      <Calculator />
    </div>
  );
};

export default Index;
