import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
  } from "recharts";
  
  const EmotionChart = ({ emotions }) => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={emotions}>
          <XAxis dataKey="emotion" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count">
            {emotions.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.chartColor || "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default EmotionChart;