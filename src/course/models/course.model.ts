import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Base from '@database/models/base';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import SectionEntity from '@section/models/section.model';
import CategoryEntity from '@category/models/category.model';
import AdminEntity from '@user/models/admin.model';

@Entity('course')
class CourseEntity extends Base {
  @Column({ type: 'varchar', length: 255, default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.ACTIVE })
  status: CourseStatus;

  @OneToMany(() => SectionEntity, (section) => section.course)
  sections: Promise<SectionEntity[]>;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({ name: 'course_category' })
  categories: CategoryEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.courses)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;
}

export default CourseEntity;
