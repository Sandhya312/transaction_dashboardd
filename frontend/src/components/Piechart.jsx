import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
} from "recharts";

const Piechart = ({ stats, month }) => {
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const dataWithColors = stats.map((entry) => ({
    ...entry,
    color: getRandomColor(),
  }));

  return (
    <div className="text-center mt-10 felx flex-col items-center">
      <h1 className="text-2xl inline-block font-bold">
        Category Pie Chart - {month}
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithColors}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Piechart;
