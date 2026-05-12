"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useCallback, useRef } from "react";
import type {
  HTMLAttributeAnchorTarget,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "ghost" | "ghostDark";

type ButtonBaseProps = {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  /** Render a down-pointing arrow that nudges on hover. Useful for
   *  download CTAs. Mutually exclusive with `arrow`. */
  downArrow?: boolean;
  variant?: ButtonVariant;
};

type SharedElementProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  id?: string;
  title?: string;
};

type ButtonAsButtonProps = ButtonBaseProps &
  SharedElementProps & {
    disabled?: boolean;
    href?: never;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  SharedElementProps & {
    download?: boolean | string;
    href: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    rel?: string;
    target?: HTMLAttributeAnchorTarget;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export type NavPillProps = {
  active?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-accent text-white",
  ghost:
    "btn-fill-host relative overflow-hidden border-accent bg-transparent text-accent",
  ghostDark:
    "btn-fill-host relative overflow-hidden border-accent bg-transparent text-text-dark",
};

const hoverFilter: Record<ButtonVariant, string> = {
  primary: "brightness(0.9)",
  ghost: "brightness(1)",
  ghostDark: "brightness(1)",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

function sharedProps(props: SharedElementProps) {
  return {
    "aria-describedby": props["aria-describedby"],
    "aria-label": props["aria-label"],
    id: props.id,
    title: props.title,
  };
}

function useMagneticProps(active: boolean) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, mass: 0.4, stiffness: 220 });
  const springY = useSpring(y, { damping: 18, mass: 0.4, stiffness: 220 });
  const reduce = useReducedMotion();

  const setNode = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  if (!active || reduce) {
    return {};
  }

  return {
    onMouseEnter: () => {
      const node = nodeRef.current;
      if (node) rectRef.current = node.getBoundingClientRect();
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
    onMouseMove: (event: ReactMouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((event.clientX - cx) * 0.22);
      y.set((event.clientY - cy) * 0.4);
    },
    ref: setNode,
    style: { x: springX, y: springY },
  };
}

export function Button(props: ButtonProps) {
  const {
    arrow = false,
    children,
    className,
    downArrow = false,
    variant = "primary",
    ...rest
  } = props;

  const magneticProps = useMagneticProps(variant === "primary");

  const classes = cx(
    "group/btn inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition-[filter,background,border-color,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60",
    buttonVariants[variant],
    className,
  );

  const motionProps = {
    transition: { duration: 0.15 },
    whileHover: { filter: hoverFilter[variant] },
    whileTap: { scale: 0.97 },
  };

  const isGhost = variant === "ghost" || variant === "ghostDark";
  const label =
    arrow || downArrow ? (
      <>
        {children}
        {downArrow ? <ButtonDownArrow /> : <ButtonArrow />}
      </>
    ) : (
      children
    );
  const inner = isGhost ? (
    <>
      <span aria-hidden="true" className="btn-fill" />
      <span className="btn-label">{label}</span>
    </>
  ) : (
    label
  );

  if ("href" in rest && rest.href) {
    const { download, href, onClick, target, rel } = rest;
    const safeRel = target === "_blank" ? (rel ?? "noreferrer") : rel;

    if (isInternalHref(href) && !download) {
      return (
        <Link
          className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={href}
          onClick={onClick}
          rel={safeRel}
          target={target}
          {...sharedProps(rest)}
        >
          <motion.span
            className={classes}
            {...magneticProps}
            {...motionProps}
          >
            {inner}
          </motion.span>
        </Link>
      );
    }

    return (
      <motion.a
        className={classes}
        download={download}
        href={href}
        onClick={onClick}
        rel={safeRel}
        target={target}
        {...sharedProps(rest)}
        {...magneticProps}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  const buttonProps = rest as ButtonAsButtonProps;
  const { disabled, onClick, type = "button" } = buttonProps;

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...sharedProps(buttonProps)}
      {...magneticProps}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}

function ButtonArrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-flex h-[1em] w-[1em] items-center justify-center overflow-hidden"
    >
      <svg
        className="h-[0.85em] w-[0.85em] -translate-x-[1px] transition-transform duration-300 ease-out group-hover/btn:translate-x-[3px] motion-reduce:transition-none motion-reduce:group-hover/btn:translate-x-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14" />
        <path d="m13 5 7 7-7 7" />
      </svg>
    </span>
  );
}

function ButtonDownArrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-flex h-[1em] w-[1em] items-center justify-center overflow-hidden"
    >
      <svg
        className="h-[0.85em] w-[0.85em] -translate-y-[1px] transition-transform duration-300 ease-out group-hover/btn:translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover/btn:translate-y-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 5v14" />
        <path d="m5 13 7 7 7-7" />
      </svg>
    </span>
  );
}

export function NavPill({
  active = false,
  children,
  className,
  href,
}: NavPillProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="inline-flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={href}
    >
      <motion.span
        className={cx(
          "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-[filter,background,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          active ? "bg-accent text-white" : "bg-transparent text-text-light",
          className,
        )}
        transition={{ duration: 0.15 }}
        whileHover={{ filter: active ? "brightness(0.9)" : "brightness(1.1)" }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
