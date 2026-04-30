import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'

export class QueryPaginationRequest {
       @IsOptional()
       @IsNumberString()
       page?: string

       @IsOptional()
       @IsNumberString()
       limit?: string

       @IsOptional()
       @IsString()
       sortBy?: string

       @IsOptional()
       @IsIn(['asc', 'desc'])
       sortOrder?: 'asc' | 'desc'

       @IsOptional()
       @IsString()
       searchFields?: string[]

       @IsOptional()
       @IsString()
       search?: string

       @IsOptional()
       @IsString()
       role?: string

       @IsOptional()
       @IsObject()
       filters?: Record<string, any>
}

export class QueryPaginationResponse {
       @ApiProperty({
              description: 'Total number of items available in the database for this resource',
              example: 124
       })
       total: number

       @ApiProperty({
              description: 'Current page number',
              example: 1
       })
       page: number

       @ApiProperty({
              description: 'Number of items returned per page',
              example: 20
       })
       limit: number

       @ApiProperty({
              description: 'Total number of pages calculated based on total and limit',
              example: 7
       })
       totalPages: number

       @ApiProperty({
              description: 'Next page number if available, otherwise null',
              example: 2,
              nullable: true
       })
       nextPage: number | null

       @ApiProperty({
              description: 'Previous page number if available, otherwise null',
              example: null,
              nullable: true
       })
       prevPage: number | null
}
