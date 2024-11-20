Colors:


#ff7600 Orange

#007e8f Blue

#00d6d3 Light Blue

#77efff Lightest Blue

#023c3b Teal

#ffb87b Light Orange


Current Performance 
FPS
Localhost 19-42 : 15-44

HTML 13-47

OptimizationLevel
// 0 - none, 
// 1 - reduced lighting, 
// 2 - no SSAO, 
// 3 - ?


problem
slow pc is not checking as freqently as other,

should optimize a lot faster


OptimizationsLevels are at a good spot where Macbook can run 
level 2 smoothly at 60, 
but level 3 with no fans running 

now i need to properly transition inbetween the levels 

also need to properly set up a tracking of screen size and Ratio to work with zooming the camera out of the scene 

try fade the bloom 
MeshLambertMaterial

Set object.matrixAutoUpdate = false for static or rarely moving objects and manually call object.updateMatrix() whenever their position/rotation/quaternion/scale are updated.

When testing the performance of your apps, one of the first things you’ll need to do is check whether it is CPU bound, or GPU bound. Replace all materials with basic material using scene.overrideMaterial (see beginners tips and the start of the page). If performance increases, then your app is GPU bound. If performance doesn’t increase, your app is CPU bound.

When performance testing on a fast machine, you’ll probably be getting the maximum frame rate of 60FPS. Run chrome using open -a "Google Chrome" --args --disable-gpu-vsync for an unlimited frame rate.

Modern mobile devices have high pixel ratios as high as 5 - consider limiting the max pixel ratio to 2 or 3 on these devices. At the expense of some very slight blurring of your scene you will gain a considerable performance increase.