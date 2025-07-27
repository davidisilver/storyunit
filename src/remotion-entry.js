const {
  registerRoot,
  Composition,
  AbsoluteFill,
} = require("remotion");

// Super simple test component
const MainComposition = () => {
  console.log("MainComposition is being executed!");
  console.log("This is a test log from the Remotion component!");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "orange",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "80px",
        fontWeight: "bold",
      }}
    >
      <div>
        <div>ORANGE TEST</div>
        <div style={{ fontSize: "40px", marginTop: "20px" }}>
          JS Component is working!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Export the component as named export
module.exports = { MainComposition };

// Register the root component
registerRoot(() => {
  return (
    <Composition
      id="test-composition"
      component={MainComposition}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}); 