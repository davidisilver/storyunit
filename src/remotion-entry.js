const React = require("react");
const { registerRoot, Composition, AbsoluteFill } = require("remotion");

// Super simple test component
const MainComposition = () => {
  console.log("MainComposition is being executed!");
  console.log("This is a test log from the Remotion component!");

  return React.createElement(AbsoluteFill, {
    style: {
      backgroundColor: "orange",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "80px",
      fontWeight: "bold",
    }
  }, 
    React.createElement("div", {}, 
      React.createElement("div", {}, "ORANGE TEST"),
      React.createElement("div", { 
        style: { fontSize: "40px", marginTop: "20px" } 
      }, "JS Component is working!")
    )
  );
};

// Export the component as default export
module.exports = MainComposition;

// Register the root component
registerRoot(() => {
  return React.createElement(Composition, {
    id: "test-composition",
    component: MainComposition,
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080
  });
});
