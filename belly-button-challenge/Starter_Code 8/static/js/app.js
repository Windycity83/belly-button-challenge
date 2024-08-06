// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id == sample); 
    let objects = info[0]; 

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select["sample-metadata"];


    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (id in objects){
      panel.append("h5").text(`${id.toUppercase()}:${objects[id]}`)
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples; 

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];
    console.log(info);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      },
      text: otu_labels
      };

    let bubble_traces = [bubble_trace];

    let bubble_layout = {
      title: 'Bacteria Cultures per Sample',
      margin:{t:0},
      hovermode:"closest",
      xaxis:{title:"otu_ids"},
      yaxis:{title:"Number of Bacteria"},
      margin:{t:30},
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_traces, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      //marker: {
       // colorscale: "Electric",
        //color: sample_values.slice(0, 10).reverse()
      //},
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };


    // Render the Bar Chart
    let traces = [trace1];

     // Apply a title to the layout
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin:{t:30,l:150},
      xaxis:{title:"Number of Bacteria"}
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", traces, layout);

   });
}

   

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

  // Get the names field
  let sampleNames = data.names;

  // Use d3 to select the dropdown with id of `#selDataset`
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  // Hint: Inside a loop, you will need to use d3 to append a new
  // option for each sample name.
  for (let i = 0; i < sampleNames.length; i++){
    selector
      .append("option")
      .text(sampleNames[i])
      .property("value", sampleNames[i]);
  };

  // Get the first sample from the list
  let firstSample = sampleNames[0];

  // Build charts and metadata panel with the first sample
  buildCharts(firstSample);
  buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
