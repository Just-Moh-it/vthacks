import Spline from "@splinetool/react-spline";

export function LoadingScreen() {
  return (
    <>
      <div className="absolute inset-0 z-20">
        <Spline scene="https://prod.spline.design/Sy8XyGFZlk19gDUD/scene.splinecode" />
      </div>
      <div className="max-w-screen flex h-full max-h-screen w-full items-center justify-center">
        <h1 className="font-display z-30 text-5xl font-bold">Thinking...</h1>
      </div>
    </>
  );
}
