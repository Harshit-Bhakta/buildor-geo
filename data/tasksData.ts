export const tasksData: Task[] = [
  {
    id: "flood-mapping",
    title: "Flood Mapping",
    icon: "📊",
    description: "Analyze flood-prone areas across river systems",
    difficulty: "Intermediate",
    estimatedTime: "2-3 hours",
    subTasks: [
      {
        id: "analyze-flood-data",
        title: "Analyze Flood Data",
        description: "In this task, you will analyze flood data over the river systems in Kerala, India. We will start by loading the flood datasets and visualizing the flood-prone areas on the map to identify regions at risk.",
        objectives: [
          "Load flood datasets (Kerala_Rivers.geojson, Kerala_Flood_zones.tif)",
          "Visualize flood-prone areas on the map for analysis"
        ],
        datasets: [
          { name: "Kerala_Rivers.geojson", icon: "🗺️" },
          { name: "Kerala_Flood_zones.tif", icon: "📊" }
        ],
        starterCode: `import geopandas as gpd
import rasterio
from rasterio.plot import show
import matplotlib.pyplot as plt

# File paths to flood datasets
rivers_fp = 'datasets/Kerala_Rivers.geojson'
flood_zones_fp = 'datasets/Kerala_Flood_zones.tif'

# Load datasets
rivers = gpd.read_file(rivers_fp)
flood_zones = rasterio.open(flood_zones_fp)

# Plot the datasets
fig, ax = plt.subplots(figsize=(12, 8))
show(flood_zones, ax=ax, cmap="Blues", alpha=0.6)
rivers.plot(ax=ax, linewidth=1, color='red')
plt.show()`,
        mapImage: "/image.png",
        location: {
          name: "New York, USA",
          coordinates: [-74.0060, 40.7128]
        },
        learningContent: {
          briefing: "Flood mapping is critical for disaster preparedness. You'll learn to overlay vector and raster data.",
          keyPoints: [
            "GeoPandas for vector data",
            "Rasterio for raster data",
            "Matplotlib for visualization"
          ]
        },
        stepNumber: 1
      },
      {
        id: "clip-land-use",
        title: "Clip Land Use With Lakes",
        description: "Intersect land use polygons with lake polygons to identify affected areas.",
        objectives: [
          "Load land use and lake shapefiles",
          "Perform spatial clipping operation",
          "Calculate affected area statistics"
        ],
        datasets: [
          { name: "Kerala_LandUse.shp", icon: "🌳" },
          { name: "Kerala_Lakes.shp", icon: "💧" }
        ],
        starterCode: `import geopandas as gpd

# Load datasets
land_use = gpd.read_file('datasets/Kerala_LandUse.shp')
lakes = gpd.read_file('datasets/Kerala_Lakes.shp')

# Perform clipping
clipped = gpd.clip(land_use, lakes)

# Calculate area
clipped['area_sqkm'] = clipped.geometry.area / 1e6

# Visualize
clipped.plot(column='land_type', legend=True, figsize=(12, 8))
plt.show()`,
        mapImage: "/image.png",
        location: {
          name: "London, UK",
          coordinates: [-0.1276, 51.5074]
        },
        learningContent: {
          briefing: "Spatial clipping helps identify overlapping regions between different geographic features.",
          keyPoints: [
            "Spatial overlay operations",
            "GeoPandas clip function",
            "Area calculations"
          ]
        },
        stepNumber: 2
      },
      {
        id: "buffer-analysis",
        title: "Buffer Analysis Around Rivers",
        description: "Create buffer zones around rivers to identify flood risk areas.",
        objectives: [
          "Create 500m buffer zones around rivers",
          "Identify settlements within buffer zones",
          "Generate risk assessment report"
        ],
        datasets: [
          { name: "Kerala_Rivers.geojson", icon: "🗺️" },
          { name: "Kerala_Settlements.shp", icon: "🏘️" }
        ],
        starterCode: `import geopandas as gpd

# Load datasets
rivers = gpd.read_file('datasets/Kerala_Rivers.geojson')
settlements = gpd.read_file('datasets/Kerala_Settlements.shp')

# Create buffer (500 meters)
buffer_500m = rivers.buffer(500)

# Find settlements in buffer zone
at_risk = gpd.sjoin(settlements, buffer_500m, predicate='within')

print(f"Settlements at risk: {len(at_risk)}")
at_risk.plot(color='red', figsize=(12, 8))`,
        mapImage: "/image.png",
        location: {
          name: "Mumbai, India",
          coordinates: [72.8777, 19.0760]
        },
        learningContent: {
          briefing: "Buffer analysis is essential for risk assessment and planning.",
          keyPoints: [
            "Buffer operations",
            "Spatial queries",
            "Risk assessment"
          ]
        },
        stepNumber: 3
      },
      {
        id: "calculate-statistics",
        title: "Calculate Flood Statistics",
        description: "Generate comprehensive statistics for flood-affected regions.",
        objectives: [
          "Calculate total affected area",
          "Count affected settlements",
          "Generate summary report"
        ],
        datasets: [
          { name: "Flood_Results.shp", icon: "📈" }
        ],
        starterCode: `import geopandas as gpd
import pandas as pd

# Load processed data
results = gpd.read_file('datasets/Flood_Results.shp')

# Calculate statistics
total_area = results.geometry.area.sum() / 1e6
settlement_count = len(results)

# Generate report
report = {
    'Total Area (sq km)': total_area,
    'Affected Settlements': settlement_count,
    'Average Risk Level': results['risk'].mean()
}

print(pd.DataFrame([report]))`,
        mapImage: "/image.png",
        location: {
          name: "Lagos, Nigeria",
          coordinates: [3.3792, 6.5244]
        },
        learningContent: {
          briefing: "Statistical analysis helps quantify flood impact for decision-making.",
          keyPoints: [
            "Area calculations",
            "Aggregation functions",
            "Report generation"
          ]
        },
        stepNumber: 4
      },
      {
        id: "export-results",
        title: "Export Final Results",
        description: "Export processed data and visualizations for reporting.",
        objectives: [
          "Export results to shapefile",
          "Generate final visualization",
          "Create summary PDF report"
        ],
        datasets: [
          { name: "Final_Analysis.shp", icon: "💾" }
        ],
        starterCode: `import geopandas as gpd
import matplotlib.pyplot as plt

# Load final data
final_data = gpd.read_file('datasets/Final_Analysis.shp')

# Export to file
final_data.to_file('output/flood_analysis_results.shp')

# Create final map
fig, ax = plt.subplots(figsize=(15, 10))
final_data.plot(column='risk_level', 
                 cmap='YlOrRd', 
                 legend=True, 
                 ax=ax)
plt.title('Flood Risk Analysis - Kerala')
plt.savefig('output/final_map.png', dpi=300)`,
        mapImage: "/image.png",
        location: {
          name: "São Paulo, Brazil",
          coordinates: [-46.6333, -23.5505]
        },
        learningContent: {
          briefing: "Proper data export ensures results can be shared and used by stakeholders.",
          keyPoints: [
            "File export formats",
            "Visualization best practices",
            "Report generation"
          ]
        },
        stepNumber: 5
      },
      {
        id: "validate-results",
        title: "Validate Analysis Results",
        description: "Cross-validate flood analysis with ground truth data.",
        objectives: [
          "Compare with historical flood data",
          "Calculate accuracy metrics",
          "Identify improvement areas"
        ],
        datasets: [
          { name: "Historical_Floods.shp", icon: "📊" }
        ],
        starterCode: `import geopandas as gpd

predicted = gpd.read_file('datasets/Predicted_Floods.shp')
actual = gpd.read_file('datasets/Historical_Floods.shp')

# Calculate overlap
overlap = gpd.overlay(predicted, actual, how='intersection')
accuracy = (overlap.area.sum() / actual.area.sum()) * 100

print(f"Prediction accuracy: {accuracy:.2f}%")`,
        mapImage: "/image.png",
        location: {
          name: "Sydney, Australia",
          coordinates: [151.2093, -33.8688]
        },
        learningContent: {
          briefing: "Validation ensures your analysis produces reliable results.",
          keyPoints: [
            "Accuracy assessment",
            "Ground truth comparison",
            "Error analysis"
          ]
        },
        stepNumber: 6
      }
    ]
  },
  {
    id: "update-boundaries",
    title: "Update Boundaries",
    icon: "🧭",
    description: "Revise and update administrative boundaries",
    difficulty: "Advanced",
    estimatedTime: "3-4 hours",
    subTasks: [
      {
        id: "boundary-import",
        title: "Import New Boundary Data",
        description: "Load and validate new administrative boundary datasets.",
        objectives: [
          "Import updated boundary shapefiles",
          "Validate geometry and attributes",
          "Check for topology errors"
        ],
        datasets: [
          { name: "New_Boundaries_2024.shp", icon: "🗺️" },
          { name: "Old_Boundaries_2023.shp", icon: "📁" }
        ],
        starterCode: `import geopandas as gpd

# Load new boundaries
new_bounds = gpd.read_file('datasets/New_Boundaries_2024.shp')

# Validate geometry
print("Valid geometries:", new_bounds.is_valid.all())
print("\\nBoundary Info:")
print(new_bounds.info())`,
        mapImage: "/image.png",
        location: {
          name: "Tokyo, Japan",
          coordinates: [139.6917, 35.6895]
        },
        learningContent: {
          briefing: "Boundary updates require careful validation to ensure data integrity.",
          keyPoints: [
            "Geometry validation",
            "Topology checks",
            "Attribute inspection"
          ]
        },
        stepNumber: 1
      },
      {
        id: "boundary-comparison",
        title: "Compare Old vs New Boundaries",
        description: "Analyze differences between old and new boundary datasets.",
        objectives: [
          "Overlay old and new boundaries",
          "Identify changed regions",
          "Calculate area differences"
        ],
        datasets: [
          { name: "Old_Boundaries.shp", icon: "📁" },
          { name: "New_Boundaries.shp", icon: "🆕" }
        ],
        starterCode: `import geopandas as gpd

old = gpd.read_file('datasets/Old_Boundaries.shp')
new = gpd.read_file('datasets/New_Boundaries.shp')

# Calculate differences
difference = gpd.overlay(new, old, how='difference')
print(f"Changed area: {difference.area.sum() / 1e6:.2f} sq km")`,
        mapImage: "/image.png",
        location: {
          name: "Berlin, Germany",
          coordinates: [13.4050, 52.5200]
        },
        learningContent: {
          briefing: "Comparing boundaries helps identify administrative changes.",
          keyPoints: [
            "Spatial overlay",
            "Difference analysis",
            "Change detection"
          ]
        },
        stepNumber: 2
      },
      {
        id: "boundary-merge",
        title: "Merge Updated Boundaries",
        description: "Combine and standardize boundary datasets.",
        objectives: [
          "Merge multiple boundary files",
          "Resolve overlaps and gaps",
          "Standardize attributes"
        ],
        datasets: [
          { name: "North_Boundaries.shp", icon: "⬆️" },
          { name: "South_Boundaries.shp", icon: "⬇️" }
        ],
        starterCode: `import geopandas as gpd

north = gpd.read_file('datasets/North_Boundaries.shp')
south = gpd.read_file('datasets/South_Boundaries.shp')

# Merge datasets
merged = gpd.GeoDataFrame(pd.concat([north, south]))
merged = merged.dissolve(by='admin_level')`,
        mapImage: "/image.png",
        location: {
          name: "Cairo, Egypt",
          coordinates: [31.2357, 30.0444]
        },
        learningContent: {
          briefing: "Merging boundaries creates seamless administrative datasets.",
          keyPoints: [
            "Data concatenation",
            "Dissolve operations",
            "Attribute standardization"
          ]
        },
        stepNumber: 3
      },
      {
        id: "boundary-simplify",
        title: "Simplify Boundary Geometry",
        description: "Reduce complexity while preserving shape accuracy.",
        objectives: [
          "Apply simplification algorithms",
          "Balance detail vs file size",
          "Maintain spatial accuracy"
        ],
        datasets: [
          { name: "Detailed_Boundaries.shp", icon: "🔍" }
        ],
        starterCode: `import geopandas as gpd

detailed = gpd.read_file('datasets/Detailed_Boundaries.shp')

# Simplify geometry (tolerance in map units)
simplified = detailed.simplify(tolerance=0.001, preserve_topology=True)

print(f"Original vertices: {detailed.geometry.apply(lambda x: len(x.exterior.coords)).sum()}")
print(f"Simplified vertices: {simplified.apply(lambda x: len(x.exterior.coords)).sum()}")`,
        mapImage: "/image.png",
        location: {
          name: "Toronto, Canada",
          coordinates: [-79.3832, 43.6532]
        },
        learningContent: {
          briefing: "Simplification reduces data size while maintaining visual accuracy.",
          keyPoints: [
            "Simplification algorithms",
            "Topology preservation",
            "Performance optimization"
          ]
        },
        stepNumber: 4
      },
      {
        id: "boundary-export",
        title: "Export Final Boundaries",
        description: "Export validated and updated boundary data.",
        objectives: [
          "Export to multiple formats",
          "Generate metadata",
          "Create documentation"
        ],
        datasets: [
          { name: "Final_Boundaries.shp", icon: "✅" }
        ],
        starterCode: `import geopandas as gpd

final = gpd.read_file('datasets/Final_Boundaries.shp')

# Export to multiple formats
final.to_file('output/boundaries.shp')
final.to_file('output/boundaries.geojson', driver='GeoJSON')
final.to_file('output/boundaries.gpkg', driver='GPKG')`,
        mapImage: "/image.png",
        location: {
          name: "Melbourne, Australia",
          coordinates: [144.9631, -37.8136]
        },
        learningContent: {
          briefing: "Multi-format export ensures compatibility with different GIS systems.",
          keyPoints: [
            "Format conversion",
            "Metadata generation",
            "Documentation"
          ]
        },
        stepNumber: 5
      }
    ]
  },
  {
    id: "process-lidar",
    title: "Process Lidar Data",
    icon: "🛰️",
    description: "Analyze high-resolution elevation data",
    difficulty: "Expert",
    estimatedTime: "4-5 hours",
    subTasks: [
      {
        id: "lidar-load",
        title: "Load and Visualize LiDAR",
        description: "Import LiDAR point cloud data and create digital elevation models.",
        objectives: [
          "Load LiDAR point cloud",
          "Create DEM from points",
          "Visualize elevation data"
        ],
        datasets: [
          { name: "Lidar_PointCloud.las", icon: "☁️" },
          { name: "Study_Area.shp", icon: "📍" }
        ],
        starterCode: `import laspy
import numpy as np
import matplotlib.pyplot as plt

# Load LiDAR point cloud
las = laspy.read('datasets/Lidar_PointCloud.las')

# Extract coordinates
x = las.x
y = las.y
z = las.z

print(f"Total points: {len(x)}")
print(f"Elevation range: {z.min():.2f}m to {z.max():.2f}m")`,
        mapImage: "/image.png",
        location: {
          name: "Los Angeles, USA",
          coordinates: [-118.2437, 34.0522]
        },
        learningContent: {
          briefing: "LiDAR data provides highly accurate elevation information for terrain analysis.",
          keyPoints: [
            "Point cloud processing",
            "DEM generation",
            "Terrain analysis"
          ]
        },
        stepNumber: 1
      },
      {
        id: "lidar-filter",
        title: "Filter Ground Points",
        description: "Classify and filter ground points from LiDAR data.",
        objectives: [
          "Apply classification algorithms",
          "Separate ground from non-ground",
          "Generate ground surface"
        ],
        datasets: [
          { name: "Raw_LiDAR.las", icon: "☁️" }
        ],
        starterCode: `import laspy

las = laspy.read('datasets/Raw_LiDAR.las')

# Filter ground points (classification = 2)
ground_points = las.points[las.classification == 2]

print(f"Ground points: {len(ground_points)}")`,
        mapImage: "/image.png",
        location: {
          name: "Paris, France",
          coordinates: [2.3522, 48.8566]
        },
        learningContent: {
          briefing: "Ground point classification is essential for accurate terrain modeling.",
          keyPoints: [
            "Point classification",
            "Ground filtering",
            "Surface generation"
          ]
        },
        stepNumber: 2
      },
      {
        id: "lidar-dem",
        title: "Create Digital Elevation Model",
        description: "Generate DEM from filtered LiDAR points.",
        objectives: [
          "Interpolate elevation surface",
          "Create raster DEM",
          "Apply smoothing filters"
        ],
        datasets: [
          { name: "Ground_Points.las", icon: "🗻" }
        ],
        starterCode: `from scipy.interpolate import griddata
import numpy as np

# Create grid
xi = np.linspace(x.min(), x.max(), 1000)
yi = np.linspace(y.min(), y.max(), 1000)
xi, yi = np.meshgrid(xi, yi)

# Interpolate
zi = griddata((x, y), z, (xi, yi), method='cubic')`,
        mapImage: "/image.png",
        location: {
          name: "Singapore",
          coordinates: [103.8198, 1.3521]
        },
        learningContent: {
          briefing: "DEM creation transforms point clouds into continuous elevation surfaces.",
          keyPoints: [
            "Interpolation methods",
            "Raster creation",
            "Smoothing techniques"
          ]
        },
        stepNumber: 3
      },
      {
        id: "lidar-analysis",
        title: "Terrain Analysis",
        description: "Derive slope, aspect, and hillshade from DEM.",
        objectives: [
          "Calculate slope and aspect",
          "Generate hillshade",
          "Identify terrain features"
        ],
        datasets: [
          { name: "DEM.tif", icon: "🗻" }
        ],
        starterCode: `import rasterio
from rasterio.plot import show
import numpy as np

dem = rasterio.open('datasets/DEM.tif')
elevation = dem.read(1)

# Calculate slope
dx = np.gradient(elevation, axis=1)
dy = np.gradient(elevation, axis=0)
slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))`,
        mapImage: "/image.png",
        location: {
          name: "Johannesburg, South Africa",
          coordinates: [28.0473, -26.2041]
        },
        learningContent: {
          briefing: "Terrain analysis reveals landscape characteristics for planning and analysis.",
          keyPoints: [
            "Slope calculation",
            "Aspect determination",
            "Hillshade generation"
          ]
        },
        stepNumber: 4
      },
      {
        id: "lidar-export",
        title: "Export Analysis Results",
        description: "Export terrain analysis products for use in other applications.",
        objectives: [
          "Export DEM and derivatives",
          "Create 3D visualizations",
          "Generate reports"
        ],
        datasets: [
          { name: "Terrain_Products.tif", icon: "💾" }
        ],
        starterCode: `import rasterio

with rasterio.open('output/slope.tif', 'w', **profile) as dst:
    dst.write(slope, 1)

with rasterio.open('output/aspect.tif', 'w', **profile) as dst:
    dst.write(aspect, 1)

print("Terrain products exported successfully")`,
        mapImage: "/image.png",
        location: {
          name: "Buenos Aires, Argentina",
          coordinates: [-58.3816, -34.6037]
        },
        learningContent: {
          briefing: "Exporting terrain products enables integration with other GIS workflows.",
          keyPoints: [
            "Raster export",
            "Format compatibility",
            "Metadata creation"
          ]
        },
        stepNumber: 5
      }
    ]
  }
];