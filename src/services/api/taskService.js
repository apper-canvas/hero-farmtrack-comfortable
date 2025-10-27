import { getApperClient } from "@/services/apperClient";

class TaskService {
  constructor() {
    this.tableName = "task_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
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
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            title_c: taskData.title_c,
            description_c: taskData.description_c || "",
            due_date_c: taskData.due_date_c,
            priority_c: taskData.priority_c,
            completed_c: false,
            completed_at_c: null,
            farm_id_c: parseInt(taskData.farm_id_c?.Id || taskData.farm_id_c)
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
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updateRecord = {
        Id: parseInt(id)
      };

      if (taskData.title_c !== undefined) updateRecord.title_c = taskData.title_c;
      if (taskData.description_c !== undefined) updateRecord.description_c = taskData.description_c;
      if (taskData.due_date_c !== undefined) updateRecord.due_date_c = taskData.due_date_c;
      if (taskData.priority_c !== undefined) updateRecord.priority_c = taskData.priority_c;
      if (taskData.completed_c !== undefined) updateRecord.completed_c = taskData.completed_c;
      if (taskData.completed_at_c !== undefined) updateRecord.completed_at_c = taskData.completed_at_c;
      if (taskData.farm_id_c !== undefined) updateRecord.farm_id_c = parseInt(taskData.farm_id_c?.Id || taskData.farm_id_c);

      const params = {
        records: [updateRecord]
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
      console.error("Error updating task:", error?.response?.data?.message || error);
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
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new TaskService();