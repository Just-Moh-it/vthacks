##Who is Lisa?
Lisa is our AI Tutor. Lisa is able to answer questions and provide detailed explanations to a wide variety of academic related topics. 

## Inspiration
I was confused in class and wished that I had access to a personal tutor 24/7. My solution to this was to use Chat GPT, but Chat GPT isn't the right tool for the job - it just so happens to work half the time. It's great when an AI is able to explain academic questions and explain them with examples. The idea of this is fairly simple when you consider that Chat GPT exists, so we wanted to take it a step further and give our AI the ability to create presentations, based on the conversation history, and present them to the user in the form of a video.

## What it does
heylisa allows a user to ask questions about academic related topics, such as math or chemistry, and get feedback in real time. Our AI also has the ability to create video presentations and present them to the user. These presentations are the core of heylisa, having someone explain how something works is easier than reading about it. These presentations include examples and the user can ask specific questions in order to get specific examples. 

## How we built it
We build heylisa with NextJS with TRPC. This allows us to have end-to-end type safety when making API calls. We make use of various AI models to generate our information. The core of heylisa uses GPT to generate all text information. We also make use of ElevenLabs for voice cloning.

## Video creation
Our video pipeline goes as follows:
User has a conversation with the AI > user asks to create a video > GPT generates video metadata based on the current context of the conversation > GPT generates the video outline (including chapters, scripts for the narrator to read, slide layouts, slide titles, slide content and image queries for slides which contain images) > [In parallel: We send the scripts to ElevenLabs which creates the narrator's voice. We send image queries to Unsplash to get images for our presentation slides. > Once all of our requests have finished, we render the video in real time on the client.

GPT fully generates the scripts based on interactions that it has had with the user. We refer to this as context. Context is simply the conversation, back and forth, between GPT and the user.

Metadata for the video includes brief talking points which will later be used to generate slides.

Generating slides is also up to GPT , we give it a very detailed prompt which contains the data that it previously generated in order to generate data about each slide. Each slide has a script, a title, and some content. The script is derived from the context and the topics from the metadata. The title is also derived from the metadata. The content depends on the layout of the slide. There are a handful of slide layouts that GPT can pick from, ranging from title and bullet points, to title and image, to image only, etc... If a template with points is selected, GPT will generate a list of points which are reflective of the narrators script. If a template with an image is being used, then GPT generates a query which will be used to search for said image. We send requests to Unsplash to get stock images for our slides. Rather than exporting a video in a common file format, we render the video in real time on the client. Rendering the video is fairly simple since we have all of our components, and we just have to put them together.

##Challenges we faced
Time: Time was the most challenging factor in all of this. This project seemed almost impossible but we decided to still go for it. With the various services that we use in our app, it took hours tom implement each one of them and get them working seamlessly with one another.

Prompts: Generating the right prompts for GPT took a lot of thought. If you've ever tried ChatGPT before, you'll know what I mean. When you consider that we want GPT to give us an output in a consistent format (structured as JSON) and in a creative way such that the slides are not super repetitive, you realize that these prompts have to be carefully thought out.

## Accomplishments that we're proud of
Our video pipeline is fairly complex but it is the core of heylisa. We are very proud of our video pipeline since in the end we get informational videos which are presented in a way which makes you think you have an actual tutor.

We also implemented a LaTex parser. This allows our app to properly format complex math equations such as limits. This was one of our goals and while we had some roadblocks, we were very satisfied when we finally finished it.

Maintaining end-type-end TypeSafety was definitely one of our other accomplishments. Usually we would deviate from TypeSafety about halfway through development, but in this case we did not.

We pushed ourselves to the limit, working for long periods of time and having to efficiently manage our time.

We also tried our best to communicate with others to give them ideas and also improve upon ours. This was very beneficial to us since we were able to get feedback from likeminded individuals.

## What we learned
We learned a lot about different AI APIs and how to integrate them together in an efficient manner. Effective planning made this all possible. Our video pipeline had hours of thought put into it in order to figure out generating scripts. We learned a lot about sequential text generation and how to properly generate response which is then fed into another prompt in order to get the final output. We also learned how expensive AI calls can be... through testing we burned through a lot of money using GPT-4. We eventually switched our model to GPT-3.5-turbo-16k. The 16k represents the context window. We chose a larger context window so when we create videos, it is based on more of the user's questions than a 4k context window and is overall more helpful.

## What's next for heylisa
We have so many other ideas that we want to implement after the hackathon is over. We wanted to implemented AI video using AI generated lip movement but simply didn't have time. We want to make our app fun with various narrators such as Elon Musk, Mr. Beast, Taylor Swift, and more. We also want to work on the practicality of it. We want to introduce a way for a user to scan a document/upload a .pdf so our app can assist them in completing it. We want to avoid giving out answers, but, for example, if a user uploads a Math homework problems on derivatives, we could then create a video with 2 or 3 example problems with step-by-step instructions. This would allow the student to better understand the material and avoid cheating. We also want to add in real time voice conversations. Having a one-on-one tutor to talk to is super helpful, and we think that with heylisa that could be available 24/7. This would basically seem like a phone call from the users perspective. 
