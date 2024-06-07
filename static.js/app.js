 
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

function init() {
 
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        let names = data.names;
        console.log("Data:", data);

        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

     
        optionChanged(names[0]);
    });
}


function updateDemographicInfo(selectedValue) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log("Metadata:", metadata);

        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0];
        console.log("Filtered Data:", obj);

        let metadataPanel = d3.select("#sample-metadata").html("");
        Object.entries(obj).forEach(([key, value]) => {
            metadataPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}


function updateBarChart(selectedValue) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        console.log("Samples:", samples);

        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        console.log("Filtered Data:", obj);

        let trace = [{
            x: obj.sample_values.slice(0, 10).reverse(),
            y: obj.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            marker: {color: "rgb(166,172,237)"},
            orientation: "h"
        }];

        let layout = {
            title: "Top 10 Bacteria Cultures Found !",
            xaxis: {title: "Number of Bacteria !"},
        };
        Plotly.newPlot("bar", trace, layout);
    });
}




function updateBubbleChart(selectedValue) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        console.log("Samples:", samples);

        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        console.log("Filtered Data:", obj);

        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Viridis"
            }
        }];
        let layout = {
            title: "Bacteria Cultures per Sample",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "No. of Bacteria"}
        };
        Plotly.newPlot("bubble", trace, layout);
    });
}

function optionChanged(selectedValue) {
    updateDemographicInfo(selectedValue);
    updateBarChart(selectedValue);
    updateBubbleChart(selectedValue);
}

init();
