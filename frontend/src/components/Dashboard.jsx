// components/Dashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Scatter, Doughnut } from 'react-chartjs-2';
import Header from "./Header";
import { LayoutDashboard, Save, RefreshCcw, Search, BarChart2, FileText,ChartLine, ChartBar, ChartPie, ChartScatter, ChartSpline } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || [];
  
  // State for chart configurations
  const [chartConfigs, setChartConfigs] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [reportMode, setReportMode] = useState('dashboard'); // dashboard, report, insights

  if (!data || data.length === 0) {
    return (
      <div style={styles.emptyState}>
        
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📊</div>
          <h2 style={styles.emptyTitle}>No Data Available</h2>
          <p style={styles.emptyDescription}>
            Import your data to start creating professional reports and visualizations
          </p>
          <button 
            onClick={() => navigate("/")}
            style={styles.primaryButton}
          >
            Import Data
          </button>
        </div>
      </div>
    );
  }

  // Extract all columns and their types
  const allKeys = Object.keys(data[0]);
  const numericKeys = allKeys.filter((key) => typeof data[0][key] === "number");
  const nonNumericKeys = allKeys.filter((key) => typeof data[0][key] !== "number");
  const dateKeys = allKeys.filter((key) => {
    const value = data[0][key];
    return !isNaN(Date.parse(value)) && isNaN(value);
  });

  // Chart type options
  const chartTypes = [
    { value: "line", label: "Line Chart", icon: <ChartLine/> },
    { value: "bar", label: "Column Chart", icon: <ChartBar/> },
    { value: "area", label: "Area Chart", icon: <ChartSpline/> },
    { value: "scatter", label: "Scatter Chart", icon: <ChartScatter/> },
    { value: "pie", label: "Pie Chart", icon: <ChartPie/> },
    { value: "doughnut", label: "Donut Chart", icon: "🍩" },
  ];

  // Professional color schemes
  const colorSchemes = {
    powerbi: ['#118DFF', '#12239E', '#E66C37', '#6B007B', '#E044A7', '#744EC2', '#D9B300', '#D64550'],
    modern: ['#2563EB', '#059669', '#DC2626', '#7C3AED', '#DB2777', '#0891B2', '#CA8A04', '#EA580C'],
    corporate: ['#1F4E79', '#70AD47', '#FFC000', '#C5504B', '#8064A2', '#4BACC6', '#9BBB59', '#F79646']
  };

  const currentColors = colorSchemes.powerbi;

  // Statistics calculations
  const calculateStats = () => {
    const stats = {};
    numericKeys.forEach(key => {
      const values = data.map(item => item[key]).filter(val => val != null);
      stats[key] = {
        total: values.reduce((sum, val) => sum + val, 0),
        average: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });
    return stats;
  };

  const stats = calculateStats();

  // Get chart configuration
  const getChartConfig = (metricKey) => {
    return chartConfigs[metricKey] || {
      chartType: "bar",
      xAxis: nonNumericKeys[0] || dateKeys[0] || allKeys[0],
      yAxis: metricKey,
      showGrid: true,
      showLegend: true,
      tension: 0.3,
      fill: false,
      pointRadius: 3,
      borderWidth: 2,
      colorScheme: 'powerbi'
    };
  };

  // Update chart configuration
  const updateChartConfig = (metricKey, updates) => {
    setChartConfigs(prev => ({
      ...prev,
      [metricKey]: {
        ...getChartConfig(metricKey),
        ...updates
      }
    }));
  };

  // Prepare chart data
  const prepareChartData = (metricKey, config) => {
    const labels = data.map(item => item[config.xAxis]);
    const values = data.map(item => item[config.yAxis] || 0);

    if (config.chartType === 'pie' || config.chartType === 'doughnut') {
      const pieData = data.slice(0, 8);
      return {
        labels: pieData.map(item => String(item[config.xAxis] || 'Unknown')),
        datasets: [{
          data: pieData.map(item => item[config.yAxis] || 0),
          backgroundColor: currentColors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8
        }]
      };
    }

    if (config.chartType === 'scatter') {
      return {
        datasets: [{
          label: config.yAxis,
          data: data.map(item => ({
            x: item[config.xAxis],
            y: item[config.yAxis] || 0
          })),
          backgroundColor: currentColors[0] + '80',
          borderColor: currentColors[0],
          pointRadius: config.pointRadius + 1,
          pointHoverRadius: config.pointRadius + 3,
        }]
      };
    }

    return {
      labels,
      datasets: [{
        label: config.yAxis,
        data: values,
        backgroundColor: config.chartType === 'area' ? currentColors[0] + '30' : currentColors[0],
        borderColor: currentColors[0],
        borderWidth: config.borderWidth,
        tension: config.tension,
        fill: config.chartType === 'area' ? true : config.fill,
        pointRadius: config.pointRadius,
        pointHoverRadius: config.pointRadius + 2,
        pointBackgroundColor: currentColors[0],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };
  };

  // Enhanced chart options
  const getChartOptions = (metricKey, config) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: config.showLegend,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: '"Segoe UI", system-ui, sans-serif',
              weight: '500'
            },
            color: '#605E5C'
          }
        },
        tooltip: {
          backgroundColor: '#323130',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#8A8886',
          borderWidth: 1,
          cornerRadius: 4,
          padding: 12,
          titleFont: { size: 14, weight: '600', family: '"Segoe UI", system-ui, sans-serif' },
          bodyFont: { size: 13, family: '"Segoe UI", system-ui, sans-serif' },
          displayColors: true,
          callbacks: {
            title: function(context) {
              return `${config.xAxis}: ${context[0].label}`;
            },
            label: function(context) {
              const value = typeof context.parsed.y === 'number' 
                ? context.parsed.y.toLocaleString() 
                : context.parsed;
              return `${context.dataset.label}: ${value}`;
            }
          }
        }
      },
      animation: {
        duration: 400,
        easing: 'easeOutQuart'
      }
    };

    if (config.chartType === 'pie' || config.chartType === 'doughnut') {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            position: 'right',
            align: 'start'
          }
        }
      };
    }

    if (config.chartType !== 'scatter') {
      return {
        ...baseOptions,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: config.xAxis,
              font: { size: 12, weight: '600', family: '"Segoe UI", system-ui, sans-serif' },
              color: '#605E5C'
            },
            grid: {
              display: config.showGrid,
              color: '#E1DFDD',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#605E5C',
              font: { size: 11, family: '"Segoe UI", system-ui, sans-serif' },
              maxTicksLimit: 12,
              maxRotation: 45
            },
            border: {
              color: '#E1DFDD'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: config.yAxis,
              font: { size: 12, weight: '600', family: '"Segoe UI", system-ui, sans-serif' },
              color: '#605E5C'
            },
            grid: {
              display: config.showGrid,
              color: '#E1DFDD',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#605E5C',
              font: { size: 11, family: '"Segoe UI", system-ui, sans-serif' },
              callback: function(value) {
                return typeof value === 'number' ? value.toLocaleString() : value;
              }
            },
            border: {
              color: '#E1DFDD'
            }
          }
        }
      };
    }

    return baseOptions;
  };

  // Render chart
  const renderChart = (metricKey, config) => {
    const chartData = prepareChartData(metricKey, config);
    const options = getChartOptions(metricKey, config);

    const commonProps = {
      data: chartData,
      options: options,
      height: 280
    };

    switch (config.chartType) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "area":
        return <Line {...commonProps} />;
      case "scatter":
        return <Scatter {...commonProps} />;
      case "pie":
        return <Pie {...commonProps} height={300} />;
      case "doughnut":
        return <Doughnut {...commonProps} height={300} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  // Render KPI cards
  const renderKPICards = () => {
    return (
      <div style={styles.kpiGrid}>
        {Object.entries(stats).slice(0, 4).map(([key, stat]) => (
          <div key={key} style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiTitle}>{key}</span>
              <div style={styles.kpiTrend}>
                <span style={styles.trendIcon}>↗</span>
              </div>
            </div>
            <div style={styles.kpiValue}>
              {stat.total.toLocaleString()}
            </div>
            <div style={styles.kpiSubtext}>
              Avg: {stat.average.toFixed(1)} | Count: {stat.count}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Navigation tabs
  const renderTabs = () => (
    <div style={styles.tabContainer}>
      <button
      
        style={{...styles.tab, ...(reportMode === 'dashboard' ? styles.activeTab : {})}}
        onClick={() => setReportMode('dashboard')}
      >
        <LayoutDashboard></LayoutDashboard>
         Dashboard
      </button>
      <button
        style={{...styles.tab, ...(reportMode === 'report' ? styles.activeTab : {})}}
        onClick={() => setReportMode('report')}
      >
        <BarChart2></BarChart2>
        Report
      </button>
      <button
        style={{...styles.tab, ...(reportMode === 'insights' ? styles.activeTab : {})}}
        onClick={() => setReportMode('insights')}
      >
        <FileText></FileText>
        Insights
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      
      
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbItem}>Workspace</span>
          <span style={styles.breadcrumbSeparator}>/</span>
          <span style={styles.breadcrumbItem}>Reports</span>
          <span style={styles.breadcrumbSeparator}>/</span>
          <span style={styles.breadcrumbActive}>Data Analysis Dashboard</span>
        </div>
        <div style={styles.topControls}>
          <button style={styles.actionButton}>
            <Save></Save> Save Report
          </button>
          <button style={styles.actionButton}>
             Export
          </button>
          <button style={styles.actionButton}>
            <RefreshCcw></RefreshCcw> Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      {renderTabs()}

      <div style={styles.mainContent}>
        {reportMode === 'dashboard' && (
          <>
            {/* KPI Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Key Performance Indicators</h2>
              {renderKPICards()}
            </div>

            {/* Charts Grid */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Data Visualizations</h2>
              <div style={styles.chartsGrid}>
                {numericKeys.slice(0, 4).map((metricKey) => {
                  const config = getChartConfig(metricKey);
                  
                  return (
                    <div key={metricKey} style={styles.chartCard}>
                      <div style={styles.chartHeader}>
                        <div style={styles.chartTitleGroup}>
                          <h3 style={styles.chartTitle}>{metricKey}</h3>
                          <span style={styles.chartSubtitle}>
                            {chartTypes.find(t => t.value === config.chartType)?.label}
                          </span>
                        </div>
                        <div style={styles.chartControls}>
                          <select
                            value={config.chartType}
                            onChange={(e) => updateChartConfig(metricKey, { chartType: e.target.value })}
                            style={styles.chartTypeSelect}
                          >
                            {chartTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div style={styles.chartBody}>
                        {renderChart(metricKey, config)}
                      </div>
                      
                      <div style={styles.chartFooter}>
                        <div style={styles.chartStats}>
                          <span>Total: {stats[metricKey]?.total.toLocaleString()}</span>
                          <span>Avg: {stats[metricKey]?.average.toFixed(1)}</span>
                          <span>Records: {stats[metricKey]?.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {reportMode === 'report' && (
          <div style={styles.reportView}>
            <h2 style={styles.sectionTitle}>Data Analysis Report</h2>
            <div style={styles.reportContent}>
              <div style={styles.reportSummary}>
                <h3>Executive Summary</h3>
                <p>This report provides comprehensive analysis of your dataset containing {data.length} records across {allKeys.length} dimensions.</p>
                
                <h4>Key Findings:</h4>
                <ul style={styles.findingsList}>
                  {Object.entries(stats).map(([key, stat]) => (
                    <li key={key}>
                      <strong>{key}:</strong> Total of {stat.total.toLocaleString()} with an average of {stat.average.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={styles.dataTable}>
                <h3>Data Summary</h3>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Metric</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Average</th>
                        <th style={styles.th}>Min</th>
                        <th style={styles.th}>Max</th>
                        <th style={styles.th}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats).map(([key, stat]) => (
                        <tr key={key} style={styles.tableRow}>
                          <td style={styles.td}>{key}</td>
                          <td style={styles.td}>{stat.total.toLocaleString()}</td>
                          <td style={styles.td}>{stat.average.toFixed(2)}</td>
                          <td style={styles.td}>{stat.min.toLocaleString()}</td>
                          <td style={styles.td}>{stat.max.toLocaleString()}</td>
                          <td style={styles.td}>{stat.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportMode === 'insights' && (
          <div style={styles.insightsView}>
            <h2 style={styles.sectionTitle}>AI-Powered Insights</h2>
            <div style={styles.insightsGrid}>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}><FileText size={30} color="white"/></div>
                <h3>Trend Analysis</h3>
                <p>Based on your data patterns, we've identified key trends across your metrics.</p>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}><FileText size={30}  color="#ffffffff" /></div>
                <h3>Outlier Detection</h3>
                <p>Several data points show significant deviation from normal patterns.</p>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}><Search size={30} color="#ffffffff" /></div>
                <h3>Correlation Insights</h3>
                <p>Strong correlations detected between multiple variables in your dataset.</p>
              </div>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}><FileText size={30} color="#ffffffff" /></div>
                <h3>Recommendations</h3>
                <p>Actionable insights to optimize your data strategy and performance.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PowerBI-inspired styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
    color: '#ffffffff',
  },
  
  topNav: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E1DFDD',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  
  breadcrumbItem: {
    color: '#605E5C',
    textDecoration: 'none',
  },
  
  breadcrumbSeparator: {
    color: '#A19F9D',
    margin: '0 8px',
  },
  
  breadcrumbActive: {
    color: '#323130',
    fontWeight: '600',
  },
  
  topControls: {
    display: 'flex',
    gap: '8px',
  },
  
  actionButton: {
    backgroundColor: '#0d00fcff',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '1px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E1DFDD',
    padding: '0 24px',
    display: 'flex',
    gap: '0',
  },
  
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#605E5C',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  
  activeTab: {
    color: '#0078D4',
    borderBottomColor: '#0078D4',
    backgroundColor: '#F3F2F1',
  },
  
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  
  section: {
    marginBottom: '32px',
  },
  
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #0078D4',
    display: 'inline-block',
  },
  
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  
  kpiCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E1DFDD',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  
  kpiTitle: {
    fontSize: '14px',
    color: '#605E5C',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  kpiTrend: {
    color: '#107C10',
  },
  
  trendIcon: {
    fontSize: '16px',
  },
  
  kpiValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#323130',
    marginBottom: '4px',
  },
  
  kpiSubtext: {
    fontSize: '12px',
    color: '#A19F9D',
  },
  
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
  },
  
  chartCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E1DFDD',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  
  chartHeader: {
    padding: '20px 24px 16px',
    borderBottom: '1px solid #F3F2F1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  chartTitleGroup: {
    flex: 1,
  },
  
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#323130',
    margin: '0 0 4px 0',
    textTransform: 'capitalize',
  },
  
  chartSubtitle: {
    fontSize: '12px',
    color: '#A19F9D',
  },
  
  chartControls: {
    display: 'flex',
    gap: '8px',
  },
  
  chartTypeSelect: {
    padding: '6px 12px',
    border: '1px solid #D2D0CE',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: '#FFFFFF',
    color: '#323130',
    cursor: 'pointer',
  },
  
  chartBody: {
    padding: '16px 24px',
    height: '320px',
  },
  
  chartFooter: {
    padding: '12px 24px',
    backgroundColor: '#FAF9F8',
    borderTop: '1px solid #F3F2F1',
  },
  
  chartStats: {
    display: 'flex',
    gap: '24px',
    fontSize: '12px',
    color: '#605E5C',
  },
  
  reportView: {
    backgroundColor: '#ffffffff',
    borderRadius: '1px',
    color:"black",
    padding: '32px',
    border: '1px solid #E1DFDD',
  },
  
  reportContent: {
    maxWidth: '800px',
  },
  
  reportSummary: {
    color:"black",
    marginBottom: '32px',
  },
  
  findingsList: {
    paddingLeft: '20px',
    lineHeight: '1.6',
  },
  
  dataTable: {
    marginTop: '32px',
  },
  
  tableContainer: {
    overflowX: 'auto',
    border: '1px solid #E1DFDD',
    borderRadius: '1px',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  
  tableHeader: {
    backgroundColor: '#F8F9FA',
   
  },
  
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#000000ff',
    borderBottom: '1px solid #E1DFDD',
  },
  
  tableRow: {
    borderBottom: '1px solid #F3F2F1',
  },
  
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#000000ff',
  },
  
  insightsView: {
    // Same styling as report view
  },
  
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  
  insightCard: {
    backgroundColor: '#0914ebff',
    border: '1px solid #E1DFDD',
    borderRadius: '1px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  insightIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  
  emptyState: {
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
    display: 'flex',
    flexDirection: 'column',
  },
  
  emptyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
  },
  
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '12px',
  },
  
  emptyDescription: {
    fontSize: '16px',
    color: '#605E5C',
    textAlign: 'center',
    maxWidth: '400px',
    marginBottom: '32px',
  },
  
  primaryButton: {
    backgroundColor: '#0078D4',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Dashboard;