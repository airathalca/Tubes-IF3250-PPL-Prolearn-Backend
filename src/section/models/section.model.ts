import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Base from '@common/models/base';
import SectionType from '@section/enum/section-type';
import CourseEntity from '@course/models/course.model';

@Entity('section')
@Tree('closure-table')
class SectionEntity extends Base {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar', length: '255', default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  objective: string;

  @Column()
  duration: number;

  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  type: SectionType;

  @ManyToOne(() => CourseEntity, (course) => course.sections)
  @JoinColumn({ name: 'courseId' })
  course: Promise<CourseEntity>;

  @TreeChildren()
  children: Promise<SectionEntity[]>;

  @TreeParent()
  parent: Promise<SectionEntity>;
}

export default SectionEntity;
