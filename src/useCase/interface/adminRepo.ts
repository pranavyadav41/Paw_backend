import User from "../../domain/user"
import franchise from "../../domain/franchise";
import approve from "../../domain/approval";
import Service from "../../domain/service";

interface adminRepo {
  getUsers(page: number, limit: number, searchTerm: string): Promise<{ users: {}[], total: number }>;
  blockUser(userId: string): Promise<boolean>
  unBlockUser(userId: string): Promise<boolean>
  getFranchiseReqests(): Promise<{}[] | null>
  approveFranchise(reqId: string): Promise<approve | boolean>
  findByEmail(email: string): Promise<franchise | null>
  rejectFranchise(reqId: string): Promise<{ status: boolean; email: string }>
  getFranchisesData():Promise<franchise[]>
  getFranchises(page: number, limit: number, searchTerm: string): Promise<{ franchises: {}[], total: number }>
  blockFranchise(franchiseId: string): Promise<boolean>
  unBlockFranchise(franchiseId: string): Promise<boolean>
  findService(categoryName: string): Promise<Service | null>
  addService(service: Service): Promise<boolean>
  editService(service: Service): Promise<boolean>
  deleteService(serviceId: string): Promise<boolean>
  getServices(): Promise<{}[] | null>
  getWeeklyData(): Promise<any>
  getMonthlyData(): Promise<any>
  getYearlyData(): Promise<any>
  getTotalBookings(): Promise<number>
  getFranchisesCount(): Promise<number>
  franchiseWeeklyData(franchiseId: string): Promise<any>
  franchiseMonthlyData(franchiseId: string): Promise<any>
  franchiseYearlyData(franchiseId: string): Promise<any>
  franchiseTotalBooking(franchiseId: string): Promise<number>
  franchiseTotalEarning(franchiseId: string): Promise<number>



}

export default adminRepo