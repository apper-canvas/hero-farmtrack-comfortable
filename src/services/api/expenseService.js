import { getApperClient } from "@/services/apperClient";

class ExpenseService {
  constructor() {
    this.tableName = "expense_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
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
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.response?.data?.message || error);
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
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
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
      console.error("Error fetching expenses by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            amount_c: parseFloat(expenseData.amount_c),
            category_c: expenseData.category_c,
            date_c: expenseData.date_c,
            description_c: expenseData.description_c,
            farm_id_c: parseInt(expenseData.farm_id_c?.Id || expenseData.farm_id_c)
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
      console.error("Error creating expense:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            amount_c: parseFloat(expenseData.amount_c),
            category_c: expenseData.category_c,
            date_c: expenseData.date_c,
            description_c: expenseData.description_c,
            farm_id_c: parseInt(expenseData.farm_id_c?.Id || expenseData.farm_id_c)
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
      console.error("Error updating expense:", error?.response?.data?.message || error);
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
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new ExpenseService();