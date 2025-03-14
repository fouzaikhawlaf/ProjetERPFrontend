// Créer un devis
export const createOrderSupplier = async (createOrderSupplierDto) => {
    try {
      const response = await apiErp.post('/create-order', createOrderSupplierDto);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };