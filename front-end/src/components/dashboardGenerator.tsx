import { Bar, Pie, Line, Bubble, Scatter, Radar } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  BubbleController,
  ScatterController,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary components with Chart.js
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  BubbleController,
  ScatterController,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define types for student data
interface Student {
  Name: string;
  Age: number;
  Height: number;
  Mass: number;
  Flexibility: {
    "Sit & Reach Test": number;
  };
  "Muscular Strength": {
    "Grip Strength": number;
    "Bench Press": number;
    "Leg Press": number;
  };
  "Cardiovascular Endurance": {
    "12-minute Run": number;
  };
}

const DashboardGenerator = () => {
  const [chartType, setChartType] = useState<string>("");
  const [xCategory, setXCategory] = useState<string>("");
  const [yCategory, setYCategory] = useState<string>("");
  const [xAxis, setXAxis] = useState<string>("");
  const [yAxis, setYAxis] = useState<string>("");

  // Updated dummy data
  const studentData: Student[] = [
    {
      Name: "Bob",
      Age: 21,
      Height: 167,
      Mass: 65,
      Flexibility: {
        "Sit & Reach Test": 4,
      },
      "Muscular Strength": {
        "Grip Strength": 10,
        "Bench Press": 40,
        "Leg Press": 70,
      },
      "Cardiovascular Endurance": {
        "12-minute Run": 3,
      },
    },
    {
      Name: "Tim",
      Age: 23,
      Height: 189,
      Mass: 89,
      Flexibility: {
        "Sit & Reach Test": 5,
      },
      "Muscular Strength": {
        "Grip Strength": 13,
        "Bench Press": 70,
        "Leg Press": 120,
      },
      "Cardiovascular Endurance": {
        "12-minute Run": 4,
      },
    },
  ];

  // Get axis options based on the selected category
  const getAxisOptions = (category: string) => {
    const options: { [key: string]: string[] } = {
      Flexibility: ["Sit & Reach Test"],
      "Muscular Strength": ["Grip Strength", "Bench Press", "Leg Press"],
      "Cardiovascular Endurance": ["12-minute Run"],
      Age: [],
      Height: [],
      Mass: [],
    };
    return options[category] || [];
  };

  // Function to get chart data based on selected x and y categories
  const getChartData = () => {
    const data: { labels: string[], datasets: any[] } = {
      labels: [],
      datasets: []
    };

    if (xCategory && yCategory) {
      const dataset = {
        label: yAxis || 'Y-Axis',
        data: studentData.map(student => {
          let xValue: number | undefined, yValue: number | undefined;
          let xLabel: string = '';

          if (xCategory === "Age" || xCategory === "Height" || xCategory === "Mass") {
            xValue = student[xCategory as keyof Student] as number;
            xLabel = `${xValue}`; // Display numeric values as labels
          } else {
            xValue = (student as any)[xCategory]?.[xAxis] || 0;
            xLabel = `${(student as any)[xCategory]?.[xAxis] || 0}`; // Use exercise value as label
          }

          if (yCategory === "Age" || yCategory === "Height" || yCategory === "Mass") {
            yValue = student[yCategory as keyof Student] as number;
          } else {
            yValue = (student as any)[yCategory]?.[yAxis] || 0;
          }

          return { x: xValue ?? 0, y: yValue ?? 0, label: xLabel };
        }),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      };

      data.labels = dataset.data.map(d => d.label); // Set labels for x-axis
      data.datasets.push(dataset);
    }

    return data;
  };

  // Function to get complex chart data for bubble and scatter charts
  const getComplexChartData = () => {
    const data: { datasets: any[] } = {
      datasets: studentData.map(student => ({
        label: student.Name,
        data: [
          { x: student.Mass, y: student.Height, r: 10 } // Example data
        ],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      })),
    };

    return data;
  };

  // Function to get chart options with axis titles
  const getChartOptions = () => {
    return {
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: xCategory || 'X-Axis',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yCategory || 'Y-Axis',
          },
        },
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    };
  };

  // Render chart based on selected type
  const renderChart = () => {
    if (!xCategory || !yCategory) {
      return <p>Please select categories for both x and y axes.</p>;
    }

    const chartData = chartType === "bubble" || chartType === "scatter" ? getComplexChartData() : getChartData();

    switch (chartType) {
      case "line":
        return <Line data={chartData as any} options={getChartOptions()} />;
      case "bar":
        return <Bar data={chartData as any} options={getChartOptions()} />;
      case "pie":
        return <Pie data={chartData as any} />;
      case "bubble":
        return <Bubble data={chartData as any} options={{ scales: { x: { type: 'linear', position: 'bottom' }, y: { beginAtZero: true } } }} />;
      case "scatter":
        return <Scatter data={chartData as any} options={{ scales: { x: { type: 'linear', position: 'bottom' }, y: { beginAtZero: true } } }} />;
      case "radar":
        return <Radar data={chartData as any} options={{ scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }} />;
      default:
        return <p>Please select a chart type.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <h1 className="text-2xl font-bold mb-1">Dashboard Generator</h1>
      <hr className="w-48 border-t-2 border-uwa-yellow mt-1 p-1" />
      <div>
        <label>Select Chart Type: </label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="">Select</option>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          <option value="bubble">Bubble</option>
          <option value="scatter">Scatter</option>
          <option value="radar">Radar</option>
        </select>
        <br></br>
        <label> X-axis Category: </label>
        <select value={xCategory} onChange={(e) => {
          setXCategory(e.target.value);
          setXAxis(""); // Reset x-axis value when category changes
        }}>
          <option value="">Select</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Muscular Strength">Muscular Strength</option>
          <option value="Cardiovascular Endurance">Cardiovascular Endurance</option>
          <option value="Age">Age</option>
          <option value="Height">Height</option>
          <option value="Mass">Mass</option>
        </select>

        {xCategory && !(xCategory === "Age" || xCategory === "Height" || xCategory === "Mass") && (
          <>
            <label> X-axis Value: </label>
            <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
              <option value="">Select</option>
              {getAxisOptions(xCategory).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </>
        )}
        <br></br>
        <label> Y-axis Category: </label>
        <select value={yCategory} onChange={(e) => {
          setYCategory(e.target.value);
          setYAxis(""); // Reset y-axis value when category changes
        }}>
          <option value="">Select</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Muscular Strength">Muscular Strength</option>
          <option value="Cardiovascular Endurance">Cardiovascular Endurance</option>
          <option value="Age">Age</option>
          <option value="Height">Height</option>
          <option value="Mass">Mass</option>
        </select>

        {yCategory && !(yCategory === "Age" || yCategory === "Height" || yCategory === "Mass") && (
          <>
            <label> Y-axis Value: </label>
            <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
              <option value="">Select</option>
              {getAxisOptions(yCategory).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </>
        )}

        {renderChart()}
      </div>
    </div>
  );
};

export default DashboardGenerator;
