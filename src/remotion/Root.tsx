import { Composition } from "remotion";
import ImageSlide from "~/remotion/slideComponents/image";
import ImageAndTitleAndPoints from "~/remotion/slideComponents/imageAndTitleAndPoints";

const Root = () => {
  return (
    <Composition
      id="main-comp"
      component={ImageAndTitleAndPoints}
      fps={30}
      durationInFrames={30 * 40}
      width={1920}
      height={1080}
      // defaultProps={{
      //   type: "image",
      //   imageUrl:
      //     "https://images.unsplash.com/photo-1614174124242-4b3656523295?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2880&q=80",
      // }}
      defaultProps={{
        imageUrl:
          "https://replicate.delivery/pbxt/IkgW9tngATq608Qf6haUXDpg81s5YBJfS9GaBiCFjdKXk4F5/art_1.png",
        points: [
          "It’s cool",
          "It looks great!",
          "It is awesome!",
          "It is cool!",
        ],
        title: "Why make it?",
        type: "imageAndTitleAndPoints",
      }}
    />
  );
};

export default Root;
