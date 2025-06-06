import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjecaoChart = ({ data }) => {
  // Transformar dados para o formato esperado pelo gráfico
  const chartData = data?.map(item => ({
    name: `Mês ${item.mes}`,
    total: item.total
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção de Licenciamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} licenças`, 'Total']}
                labelFormatter={(label) => `Projeção para ${label}`}
              />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">Sem dados disponíveis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjecaoChart;

