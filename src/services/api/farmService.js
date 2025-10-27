import { getApperClient } from "@/services/apperClient";

class FarmService {
  constructor() {
    this.tableName = "farm_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "unit_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "unit_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            name_c: farmData.name_c,
            location_c: farmData.location_c,
            size_c: parseFloat(farmData.size_c),
            unit_c: farmData.unit_c
          }
        ]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            name_c: farmData.name_c,
            location_c: farmData.location_c,
            size_c: parseFloat(farmData.size_c),
            unit_c: farmData.unit_c
          }
        ]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, JSON.stringify(failed));
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new FarmService();