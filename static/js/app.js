// Read in samples.json using d3
function optionChanged(id = "940") {
  d3.json("samples.json").then(function (data) {
    const samples = data.samples;
    const ids = samples.map(sample => sample.id);
    d3.select("#selDataset")
      .selectAll("option")
      .data(ids)
      .enter()
      .append("option")
      .html(d => d);
    const filtered = samples.filter(sample => sample.id === id)[0];

    // Get x and y values for the graph

    const sample_values = filtered.sample_values.slice(0, 10);
    const otu_ids = filtered.otu_ids.slice(0, 10);
    const hoverText = filtered.otu_labels.slice(0, 10);

    const barData = [
      {
        x: sample_values,
        y: otu_ids.map(id => "OTU " + id),
        type: "bar",
        color: "blue",
        text: hoverText,
        orientation: "h"
      }
    ];

    Plotly.newPlot("bar", barData);

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      },
      text: hoverText
    };

    var bubble = [trace1];

    var layout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", bubble, layout);
  });

  // create the function to get the necessary data
  // read the json file to get data
  {
    d3.json("samples.json").then(function (data) {
      // get the metadata info for the demographic panel
      var metadata = data.metadata;

      //console.log(metadata)

      var resultArray = metadata.filter(i => i.id == parseInt(id));
      console.log(resultArray);

      var result = resultArray[0];
      //select the panel with id of "sample-metadata"
      var sampleMetadata = d3.select("#sample-metadata");
      // clear any existing metadata
      sampleMetadata.html("");
      //add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        sampleMetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
}

optionChanged();
