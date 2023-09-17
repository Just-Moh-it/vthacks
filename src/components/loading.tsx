import Spline from "@splinetool/react-spline";

export function LoadingScreen() {
  return (
    <>
      <div className="absolute inset-0 z-20 scale-75">
        <Spline scene="https://prod.spline.design/Sy8XyGFZlk19gDUD/scene.splinecode" />
      </div>
      <div className="max-w-screen flex h-full max-h-screen w-full grow items-center justify-center text-center">
        <h1 className="relative top-[300px] z-30 font-display text-5xl font-bold">
          Thinking...
        </h1>
      </div>
    </>
  );
}
