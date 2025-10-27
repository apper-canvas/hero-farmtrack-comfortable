import { getApperClient } from "@/services/apperClient";

class CropService {
  constructor() {
    this.tableName = "crop_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "crop_type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "field_location_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
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
          { field: { Name: "crop_type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "field_location_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "crop_type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "field_location_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        where: [
          {
            FieldName: "farm_id_c",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            crop_type_c: cropData.crop_type_c,
            planting_date_c: cropData.planting_date_c,
            field_location_c: cropData.field_location_c,
            status_c: cropData.status_c,
            expected_harvest_c: cropData.expected_harvest_c,
            notes_c: cropData.notes_c || "",
            farm_id_c: parseInt(cropData.farm_id_c?.Id || cropData.farm_id_c)
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
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            crop_type_c: cropData.crop_type_c,
            planting_date_c: cropData.planting_date_c,
            field_location_c: cropData.field_location_c,
            status_c: cropData.status_c,
            expected_harvest_c: cropData.expected_harvest_c,
            notes_c: cropData.notes_c || "",
            farm_id_c: parseInt(cropData.farm_id_c?.Id || cropData.farm_id_c)
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
      console.error("Error updating crop:", error?.response?.data?.message || error);
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
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new CropService();